import { useUser } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Typography,
} from "@mui/material";
import { type GetServerSideProps } from "next";
import { prisma } from "~/server/db";
import { type CustomerDTO, customerToDTO } from "~/server/dto/customer.dto";
import {
  serviceProviderToDTO,
  type ServiceProviderDTO,
} from "~/server/dto/serviceProvider.dto";

interface Props {
  serviceProviders: ServiceProviderDTO[];
  customer: CustomerDTO;
}

const ServiceProviderCard = ({
  serviceProvider,
}: {
  serviceProvider: ServiceProviderDTO;
}) => {
  return (
    <Card
      sx={{
        maxWidth: 345,
      }}
    >
      <CardHeader
        avatar={
          <Avatar
            src={serviceProvider.profileImageURL || ""}
            alt={serviceProvider.name}
          />
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={serviceProvider.email}
        subheader={serviceProvider.profession}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <ul>
            {serviceProvider.expertise.map((expertise) => (
              <li key={expertise}>{expertise}</li>
            ))}
          </ul>
        </Typography>
      </CardContent>
    </Card>
  );
};

const Customer = ({ serviceProviders, customer }: Props) => {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <div>
        {serviceProviders.map((serviceProvider) => (
          <ServiceProviderCard
            key={serviceProvider.id}
            serviceProvider={serviceProvider}
          />
        ))}
      </div>
    );
  }

  return <div>Customer</div>;
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const { userId } = getAuth(req);
  if (!userId) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const customer = await prisma.customer.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  if (!customer) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const serviceProviders = await prisma.serviceProvider.findMany({
    include: {
      reviews: {
        include: {
          customer: {
            include: {
              user: true,
            },
          },
        },
      },
      user: true,
    },
    where: {
      profession: {
        in: customer.servicesSeeked,
      },
      expertise: {
        hasSome: customer.interests,
      },
    },
  });

  return {
    props: {
      serviceProviders: serviceProviders.map(serviceProviderToDTO),
      customer: customerToDTO(customer),
    },
  };
};

export default Customer;
